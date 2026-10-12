import type { Meta, StoryObj } from "@storybook/react-vite";

function UiVerificationDemoShell() {
  return (
    <div className="verification-demo">
      <style>{`
        .verification-demo{min-height:100vh;background:#eaf1f8;color:#1e293b;font:14px Arial,Helvetica,sans-serif}
        .verification-demo *{box-sizing:border-box}
        .verification-demo a{color:inherit;text-decoration:none}
        .verification-demo header{height:72px;display:flex;align-items:center;gap:40px;padding:0 32px;border-bottom:1px solid #e3e8ef;background:#fff}
        .verification-demo .brand{display:flex;align-items:center;gap:10px;min-width:205px;color:#162438;font-size:17px;font-weight:700}
        .verification-demo .brand-mark{width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#315f91;color:#fff;font-size:15px}
        .verification-demo .tag{padding:4px 7px;border-radius:5px;background:#eef3f8;color:#52677e;font-size:9px;letter-spacing:.08em}
        .verification-demo .primary-nav{display:flex;align-self:stretch;align-items:center;gap:28px;color:#66778b;font-size:13px}
        .verification-demo .primary-nav .active{display:flex;align-items:center;border-bottom:2px solid #315f91;color:#285780;font-weight:700}
        .verification-demo .account{display:flex;align-items:center;gap:10px;margin-left:auto;color:#46586d;font-size:12px}
        .verification-demo .avatar{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#e4edf6;color:#315f91;font-weight:700}
        .verification-demo .frame{width:min(1440px,100%);min-height:calc(100vh - 72px);display:grid;grid-template-columns:220px minmax(0,1fr);gap:34px;margin:0 auto;padding:30px 32px 40px}
        .verification-demo aside{display:flex;flex-direction:column;gap:6px;padding:8px 0;color:#64748b}
        .verification-demo .sidebar-label{margin:0 0 8px 12px;color:#92a0b1;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
        .verification-demo .sidebar-link{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:8px;font-size:13px}
        .verification-demo .sidebar-link.active{background:#e7eff7;color:#285780;font-weight:700}
        .verification-demo .sidebar-note{margin-top:auto;padding:16px 13px;border:1px solid #dfe7ef;border-radius:10px;background:#f8fafc;color:#617286;font-size:11px;line-height:1.5}
        .verification-demo .sidebar-note strong{display:block;margin-bottom:5px;color:#34475d;font-size:12px}
        .verification-demo .page-area{min-width:0;max-width:1000px}
        .verification-demo .breadcrumb{margin:2px 0 22px;color:#8693a2;font-size:11px}
        .verification-demo .page-intro{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:22px}
        .verification-demo .eyebrow{margin:0 0 7px;color:#68809a;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
        .verification-demo h1{margin:0;color:#1d2b3d;font-size:28px;line-height:1.2;letter-spacing:-.025em}
        .verification-demo .intro-copy{margin:8px 0 0;color:#718096;font-size:13px;line-height:1.5}
        .verification-demo .range{flex:none;padding:10px 13px;border:1px solid #d8e0e9;border-radius:8px;background:#fff;color:#46596f;font-size:12px}
        .verification-demo main{width:100%;padding:24px 25px 22px;border:1px solid #e2e8ef;border-radius:13px;background:#fff;box-shadow:0 5px 20px #29486d0b;color:#26384b}
        .verification-demo .panel-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:19px;border-bottom:1px solid #edf0f4}
        .verification-demo .panel-heading h2{margin:0;color:#213247;font-size:17px;line-height:1.35}
        .verification-demo .panel-heading p{margin:5px 0 0;color:#8290a0;font-size:11px}
        .verification-demo .demo-label{padding:6px 9px;border-radius:20px;background:#eef7f3;color:#37765c;font-size:10px;font-weight:700}
        .verification-demo .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;padding:18px 0 20px}
        .verification-demo .metric{min-width:0;padding:14px 15px;border:1px solid #e9edf2;border-radius:9px;background:#fcfdfe}
        .verification-demo .metric-label{display:block;color:#77879a;font-size:10px}
        .verification-demo .metric-value{display:block;margin:9px 0 5px;color:#213247;font-size:24px;font-weight:700;letter-spacing:-.03em}
        .verification-demo .metric-change{color:#4a9270;font-size:10px;font-weight:700}
        .verification-demo .chart-heading{display:flex;justify-content:space-between;margin:2px 0 14px;color:#43566b;font-size:11px}
        .verification-demo .chart{height:112px;display:flex;align-items:flex-end;gap:13px;padding:0 7px 21px;border-bottom:1px solid #e8edf2;background:repeating-linear-gradient(to bottom,transparent 0,transparent 27px,#eef1f5 28px)}
        .verification-demo .bar-column{height:100%;flex:1;display:flex;align-items:flex-end;justify-content:center;position:relative}
        .verification-demo .bar{width:min(25px,72%);min-height:12px;border-radius:5px 5px 0 0;background:#a9c3dc}
        .verification-demo .bar.emphasis{background:#477aa8}
        .verification-demo .bar-column::after{position:absolute;top:calc(100% + 7px);color:#8997a6;font-size:9px;content:attr(data-day)}
        .verification-demo .panel-footer{display:flex;justify-content:space-between;gap:14px;margin-top:17px;color:#8290a0;font-size:10px}
        .verification-demo .page-footnote{margin:14px 2px 0;color:#8a97a5;font-size:10px}
        @media(max-width:820px){.verification-demo header{gap:20px;padding:0 22px}.verification-demo .brand{min-width:150px}.verification-demo .primary-nav{gap:18px}.verification-demo .frame{grid-template-columns:190px minmax(0,1fr);gap:24px;padding:26px 22px}.verification-demo .metrics{gap:8px}.verification-demo .metric{padding:12px 10px}}
        @media(max-width:620px){.verification-demo header{height:62px;padding:0 18px}.verification-demo .brand{min-width:0}.verification-demo .primary-nav{display:none}.verification-demo .account-name{display:none}.verification-demo .frame{min-height:calc(100vh - 62px);display:block;padding:23px 18px 32px}.verification-demo aside{display:none}.verification-demo .breadcrumb{margin-bottom:18px}.verification-demo .page-intro{align-items:flex-start}.verification-demo h1{font-size:25px}.verification-demo .intro-copy{max-width:300px}.verification-demo .range{padding:9px 10px;font-size:10px}.verification-demo main{padding:18px 16px}.verification-demo .metrics{grid-template-columns:1fr;gap:8px;padding:14px 0 17px}.verification-demo .metric{display:grid;grid-template-columns:1fr auto;align-items:center;padding:11px 12px}.verification-demo .metric-label{grid-column:1}.verification-demo .metric-value{grid-column:2;grid-row:1/3;margin:0;font-size:20px}.verification-demo .metric-change{grid-column:1}.verification-demo .chart{gap:6px}.verification-demo .panel-heading h2{font-size:15px}.verification-demo .demo-label{font-size:9px}.verification-demo .panel-footer{align-items:flex-start;flex-direction:column}}
      `}</style>
      <header>
        <span className="brand">
          <span className="brand-mark">A</span>
          <span>Aster</span>
          <span className="tag">DEMO</span>
        </span>
        <nav className="primary-nav" aria-label="Primary navigation">
          <span className="active" aria-current="page">
            Overview
          </span>
          <span>Reports</span>
          <span>Activity</span>
        </nav>
        <div className="account">
          <span className="avatar" aria-hidden="true">
            AL
          </span>
          <span className="account-name">Alex Lee</span>
        </div>
      </header>
      <div className="frame">
        <aside aria-label="Workspace navigation">
          <p className="sidebar-label">Workspace</p>
          <span className="sidebar-link active" aria-current="page">
            Overview
          </span>
          <span className="sidebar-link">Projects</span>
          <span className="sidebar-link">Reports</span>
          <span className="sidebar-link">Settings</span>
          <div className="sidebar-note">
            <strong>Demo workspace</strong>
            Example content for local UI verification runs.
          </div>
        </aside>
        <div className="page-area">
          <p className="breadcrumb">Workspace / Overview</p>
          <div className="page-intro">
            <div>
              <p className="eyebrow">Synthetic page fixture</p>
              <h1>Overview</h1>
              <p className="intro-copy">
                A clear view of the example workspace and recent activity.
              </p>
            </div>
            <span className="range">Last 7 days</span>
          </div>
          <main aria-label="Workspace performance panel">
            <div className="panel-heading">
              <div>
                <h2>Workspace performance</h2>
                <p>Example activity from the last seven days</p>
              </div>
              <span className="demo-label">Demo data</span>
            </div>
            <div className="metrics">
              <div className="metric">
                <span className="metric-label">Active projects</span>
                <strong className="metric-value">08</strong>
                <span className="metric-change">+2 this week</span>
              </div>
              <div className="metric">
                <span className="metric-label">Tasks completed</span>
                <strong className="metric-value">124</strong>
                <span className="metric-change">+12% this week</span>
              </div>
              <div className="metric">
                <span className="metric-label">Team members</span>
                <strong className="metric-value">06</strong>
                <span className="metric-change">All up to date</span>
              </div>
            </div>
            <div className="chart-heading">
              <strong>Weekly activity</strong>
              <span>Example values</span>
            </div>
            <div
              className="chart"
              role="img"
              aria-label="Example activity rises through the week and peaks on Friday"
            >
              {[
                ["Mon", 38],
                ["Tue", 55],
                ["Wed", 47],
                ["Thu", 72],
                ["Fri", 88],
                ["Sat", 62],
                ["Sun", 45],
              ].map(([day, height], index) => (
                <span className="bar-column" data-day={day} key={day}>
                  <i
                    className={`bar${index === 2 || index === 4 ? " emphasis" : ""}`}
                    style={{ height: `${height}%` }}
                  />
                </span>
              ))}
            </div>
            <div className="panel-footer">
              <span>Example workspace - All values are synthetic</span>
              <span>Updated just now</span>
            </div>
          </main>
          <p className="page-footnote">
            This synthetic fixture demonstrates full-page capture with a focused
            comparison panel.
          </p>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "UI Verification/Demo Shell",
  component: UiVerificationDemoShell,
  parameters: {
    layout: "fullscreen",
    verification: { caseId: "vc_demo-shell" },
  },
} satisfies Meta<typeof UiVerificationDemoShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
