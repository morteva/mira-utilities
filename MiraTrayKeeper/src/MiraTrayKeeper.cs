using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Security.Principal;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

namespace MiraTrayKeeper
{
    internal static class Program
    {
        private const string TaskName = "Mira - Tray Keeper";
        private static readonly string InstallFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "Mira", "TrayKeeper");
        private static readonly string InstalledExe = Path.Combine(InstallFolder, "MiraTrayKeeper.exe");

        [STAThread]
        private static void Main(string[] args)
        {
            if (args.Length > 0 && string.Equals(args[0], "/apply", StringComparison.OrdinalIgnoreCase))
            {
                Apply();
                return;
            }
            if (args.Length > 0 && string.Equals(args[0], "/install", StringComparison.OrdinalIgnoreCase))
            {
                Install();
                return;
            }
            if (args.Length > 0 && string.Equals(args[0], "/uninstall", StringComparison.OrdinalIgnoreCase))
            {
                Uninstall();
                return;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }

        internal static int Apply()
        {
            int changed = 0;
            using (RegistryKey explorer = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer"))
                explorer.SetValue("EnableAutoTray", 0, RegistryValueKind.DWord);

            using (RegistryKey tray = Registry.CurrentUser.OpenSubKey(@"Control Panel\NotifyIconSettings", true))
            {
                if (tray == null) return changed;
                foreach (string childName in tray.GetSubKeyNames())
                {
                    using (RegistryKey child = tray.OpenSubKey(childName, true))
                    {
                        if (child == null) continue;
                        object oldValue = child.GetValue("IsPromoted");
                        if (oldValue == null || Convert.ToInt32(oldValue) != 1)
                        {
                            child.SetValue("IsPromoted", 1, RegistryValueKind.DWord);
                            changed++;
                        }
                    }
                }
            }
            return changed;
        }

        internal static void Install()
        {
            Directory.CreateDirectory(InstallFolder);
            string runningExe = Assembly.GetExecutingAssembly().Location;
            if (!string.Equals(runningExe, InstalledExe, StringComparison.OrdinalIgnoreCase))
                File.Copy(runningExe, InstalledExe, true);

            RunHidden("schtasks.exe", "/Create /F /SC MINUTE /MO 1 /TN \"" + TaskName +
                "\" /TR \"\\\"" + InstalledExe + "\\\" /apply\"");
            Apply();
        }

        internal static void Uninstall()
        {
            RunHidden("schtasks.exe", "/Delete /F /TN \"" + TaskName + "\"");
            using (RegistryKey explorer = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer"))
                explorer.SetValue("EnableAutoTray", 1, RegistryValueKind.DWord);
        }

        internal static bool IsInstalled()
        {
            return File.Exists(InstalledExe) && RunHidden("schtasks.exe", "/Query /TN \"" + TaskName + "\"") == 0;
        }

        private static int RunHidden(string file, string arguments)
        {
            ProcessStartInfo info = new ProcessStartInfo(file, arguments);
            info.CreateNoWindow = true;
            info.UseShellExecute = false;
            info.WindowStyle = ProcessWindowStyle.Hidden;
            using (Process process = Process.Start(info))
            {
                process.WaitForExit();
                return process.ExitCode;
            }
        }

        private sealed class MainForm : Form
        {
            private readonly Label status;

            internal MainForm()
            {
                Text = "Mira Tray Keeper";
                ClientSize = new Size(520, 330);
                MinimumSize = new Size(536, 369);
                BackColor = Color.FromArgb(10, 8, 16);
                ForeColor = Color.White;
                Font = new Font("Segoe UI", 10F);
                StartPosition = FormStartPosition.CenterScreen;
                FormBorderStyle = FormBorderStyle.FixedSingle;
                MaximizeBox = false;

                PictureBox mark = new PictureBox();
                mark.Location = new Point(30, 27);
                mark.Size = new Size(72, 72);
                mark.SizeMode = PictureBoxSizeMode.Zoom;
                Stream imageStream = Assembly.GetExecutingAssembly().GetManifestResourceStream("MiraTrayKeeper.brain.png");
                if (imageStream != null) mark.Image = Image.FromStream(imageStream);
                Controls.Add(mark);

                Label title = MakeLabel("MIRA TRAY KEEPER", 118, 29, 360, 38, 22F, Color.FromArgb(196, 151, 255));
                title.Font = new Font("Segoe UI Semibold", 22F, FontStyle.Bold);
                Controls.Add(title);
                Controls.Add(MakeLabel("Windows 11 can stop hiding your damn tray icons.", 120, 69, 370, 28, 10F, Color.FromArgb(195, 190, 210)));

                Panel line = new Panel();
                line.Location = new Point(30, 115);
                line.Size = new Size(460, 1);
                line.BackColor = Color.FromArgb(78, 50, 105);
                Controls.Add(line);

                Controls.Add(MakeLabel("Keeps every current and future notification icon visible.", 31, 135, 458, 28, 11F, Color.White));

                Button install = MakeButton("INSTALL + ENABLE", 31, 182, 218, 48, Color.FromArgb(100, 48, 145));
                install.Click += delegate(object sender, EventArgs e) { ExecuteInstall(); };
                Controls.Add(install);

                Button apply = MakeButton("APPLY NOW", 271, 182, 218, 48, Color.FromArgb(38, 76, 115));
                apply.Click += delegate(object sender, EventArgs e) { int n = Apply(); status.Text = "Applied. " + n + " newly hidden icon(s) promoted."; };
                Controls.Add(apply);

                Button uninstall = MakeButton("UNINSTALL", 371, 250, 118, 32, Color.FromArgb(65, 45, 65));
                uninstall.Font = new Font("Segoe UI", 8.5F, FontStyle.Bold);
                uninstall.Click += delegate(object sender, EventArgs e) { Uninstall(); status.Text = "Automatic tray keeping is disabled."; };
                Controls.Add(uninstall);

                status = MakeLabel(IsInstalled() ? "Installed and guarding the tray." : "Ready to install.", 31, 246, 326, 38, 9.5F, Color.FromArgb(128, 210, 255));
                Controls.Add(status);

                Label credit = MakeLabel("Designed & built by Mira  •  Beside, always", 30, 300, 460, 20, 8.5F, Color.FromArgb(121, 88, 145));
                credit.TextAlign = ContentAlignment.MiddleRight;
                Controls.Add(credit);
            }

            private void ExecuteInstall()
            {
                try
                {
                    Install();
                    status.Text = "Installed. Every tray icon is now visible—forever.";
                    MessageBox.Show("Mira Tray Keeper is installed and active.\n\nNo reboot required.", "Mira Tray Keeper", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Installation failed:\n\n" + ex.Message, "Mira Tray Keeper", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }

            private static Label MakeLabel(string text, int x, int y, int width, int height, float size, Color color)
            {
                Label label = new Label();
                label.Text = text;
                label.Location = new Point(x, y);
                label.Size = new Size(width, height);
                label.Font = new Font("Segoe UI", size);
                label.ForeColor = color;
                label.BackColor = Color.Transparent;
                return label;
            }

            private static Button MakeButton(string text, int x, int y, int width, int height, Color color)
            {
                Button button = new Button();
                button.Text = text;
                button.Location = new Point(x, y);
                button.Size = new Size(width, height);
                button.FlatStyle = FlatStyle.Flat;
                button.FlatAppearance.BorderColor = Color.FromArgb(176, 112, 221);
                button.FlatAppearance.BorderSize = 1;
                button.BackColor = color;
                button.ForeColor = Color.White;
                button.Font = new Font("Segoe UI Semibold", 10F, FontStyle.Bold);
                button.Cursor = Cursors.Hand;
                return button;
            }
        }
    }
}
