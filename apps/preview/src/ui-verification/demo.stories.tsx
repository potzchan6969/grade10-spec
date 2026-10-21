import type { Brand, LocaleOf } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";

type DemoLocale = LocaleOf<"grade10">;
type DemoCopy = {
  demoTag: string;
  primaryNavigation: string;
  workspaceNavigation: string;
  overview: string;
  reports: string;
  activity: string;
  workspace: string;
  projects: string;
  settings: string;
  demoWorkspace: string;
  exampleContent: string;
  breadcrumb: string;
  syntheticPageFixture: string;
  pageIntro: string;
  last7Days: string;
  performancePanel: string;
  performance: string;
  exampleActivity: string;
  demoData: string;
  activeProjects: string;
  projectChange: string;
  tasksCompleted: string;
  tasksChange: string;
  teamMembers: string;
  allUpToDate: string;
  weeklyActivity: string;
  exampleValues: string;
  chartDescription: string;
  days: readonly string[];
  exampleWorkspace: string;
  syntheticValues: string;
  updatedJustNow: string;
  pageFootnote: string;
};

const DEMO_COPY = {
  en: {
    demoTag: "DEMO",
    primaryNavigation: "Primary navigation",
    workspaceNavigation: "Workspace navigation",
    overview: "Overview",
    reports: "Reports",
    activity: "Activity",
    workspace: "Workspace",
    projects: "Projects",
    settings: "Settings",
    demoWorkspace: "Demo workspace",
    exampleContent: "Example content for local UI verification runs.",
    breadcrumb: "Workspace / Overview",
    syntheticPageFixture: "Synthetic page fixture",
    pageIntro: "A clear view of the example workspace and recent activity.",
    last7Days: "Last 7 days",
    performancePanel: "Workspace performance panel",
    performance: "Workspace performance",
    exampleActivity: "Example activity from the last seven days",
    demoData: "Demo data",
    activeProjects: "Active projects",
    projectChange: "+2 this week",
    tasksCompleted: "Tasks completed",
    tasksChange: "+12% this week",
    teamMembers: "Team members",
    allUpToDate: "All up to date",
    weeklyActivity: "Weekly activity",
    exampleValues: "Example values",
    chartDescription:
      "Example activity rises through the week and peaks on Friday",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    exampleWorkspace: "Example workspace",
    syntheticValues: "All values are synthetic",
    updatedJustNow: "Updated just now",
    pageFootnote:
      "This synthetic fixture demonstrates full-page capture with a focused comparison panel.",
  },
  "zh-Hant": {
    demoTag: "示範",
    primaryNavigation: "主要導覽",
    workspaceNavigation: "工作區導覽",
    overview: "概覽",
    reports: "報告",
    activity: "活動",
    workspace: "工作區",
    projects: "專案",
    settings: "設定",
    demoWorkspace: "示範工作區",
    exampleContent: "此內容供本機介面驗證使用。",
    breadcrumb: "工作區 / 概覽",
    syntheticPageFixture: "合成頁面範例",
    pageIntro: "清楚呈現範例工作區與近期活動。",
    last7Days: "最近 7 天",
    performancePanel: "工作區效能面板",
    performance: "工作區效能",
    exampleActivity: "過去七天的範例活動",
    demoData: "示範資料",
    activeProjects: "進行中的專案",
    projectChange: "本週 +2",
    tasksCompleted: "已完成工作",
    tasksChange: "本週 +12%",
    teamMembers: "團隊成員",
    allUpToDate: "全部已更新",
    weeklyActivity: "每週活動",
    exampleValues: "範例數值",
    chartDescription: "範例活動在一週內逐漸增加，並於星期五達到高峰",
    days: ["一", "二", "三", "四", "五", "六", "日"],
    exampleWorkspace: "範例工作區",
    syntheticValues: "所有數值皆為合成資料",
    updatedJustNow: "剛剛更新",
    pageFootnote: "此合成範例展示全頁擷取與聚焦比對面板。",
  },
  "zh-Hans": {
    demoTag: "演示",
    primaryNavigation: "主导航",
    workspaceNavigation: "工作区导航",
    overview: "概览",
    reports: "报告",
    activity: "活动",
    workspace: "工作区",
    projects: "项目",
    settings: "设置",
    demoWorkspace: "演示工作区",
    exampleContent: "此内容供本地界面验证使用。",
    breadcrumb: "工作区 / 概览",
    syntheticPageFixture: "合成页面示例",
    pageIntro: "清晰展示示例工作区和近期活动。",
    last7Days: "最近 7 天",
    performancePanel: "工作区表现面板",
    performance: "工作区表现",
    exampleActivity: "过去七天的示例活动",
    demoData: "演示数据",
    activeProjects: "活跃项目",
    projectChange: "本周 +2",
    tasksCompleted: "已完成任务",
    tasksChange: "本周 +12%",
    teamMembers: "团队成员",
    allUpToDate: "全部已更新",
    weeklyActivity: "每周活动",
    exampleValues: "示例数值",
    chartDescription: "示例活动在一周内逐渐增加，并在周五达到峰值",
    days: ["一", "二", "三", "四", "五", "六", "日"],
    exampleWorkspace: "示例工作区",
    syntheticValues: "所有数值均为合成数据",
    updatedJustNow: "刚刚更新",
    pageFootnote: "此合成示例展示整页截图与聚焦比对面板。",
  },
} satisfies Record<DemoLocale, DemoCopy>;

function UiVerificationDemoShell({
  locale = "en",
}: {
  brand?: Brand;
  locale?: DemoLocale;
}) {
  const copy = DEMO_COPY[locale];
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
          <span className="tag">{copy.demoTag}</span>
        </span>
        <nav className="primary-nav" aria-label={copy.primaryNavigation}>
          <span className="active" aria-current="page">
            {copy.overview}
          </span>
          <span>{copy.reports}</span>
          <span>{copy.activity}</span>
        </nav>
        <div className="account">
          <span className="avatar" aria-hidden="true">
            AL
          </span>
          <span className="account-name">Alex Lee</span>
        </div>
      </header>
      <div className="frame">
        <aside aria-label={copy.workspaceNavigation}>
          <p className="sidebar-label">{copy.workspace}</p>
          <span className="sidebar-link active" aria-current="page">
            {copy.overview}
          </span>
          <span className="sidebar-link">{copy.projects}</span>
          <span className="sidebar-link">{copy.reports}</span>
          <span className="sidebar-link">{copy.settings}</span>
          <div className="sidebar-note">
            <strong>{copy.demoWorkspace}</strong>
            {copy.exampleContent}
          </div>
        </aside>
        <div className="page-area">
          <p className="breadcrumb">{copy.breadcrumb}</p>
          <div className="page-intro">
            <div>
              <p className="eyebrow">{copy.syntheticPageFixture}</p>
              <h1>{copy.overview}</h1>
              <p className="intro-copy">{copy.pageIntro}</p>
            </div>
            <span className="range">{copy.last7Days}</span>
          </div>
          <main aria-label={copy.performancePanel}>
            <div className="panel-heading">
              <div>
                <h2>{copy.performance}</h2>
                <p>{copy.exampleActivity}</p>
              </div>
              <span className="demo-label">{copy.demoData}</span>
            </div>
            <div className="metrics">
              <div className="metric">
                <span className="metric-label">{copy.activeProjects}</span>
                <strong className="metric-value">08</strong>
                <span className="metric-change">{copy.projectChange}</span>
              </div>
              <div className="metric">
                <span className="metric-label">{copy.tasksCompleted}</span>
                <strong className="metric-value">124</strong>
                <span className="metric-change">{copy.tasksChange}</span>
              </div>
              <div className="metric">
                <span className="metric-label">{copy.teamMembers}</span>
                <strong className="metric-value">06</strong>
                <span className="metric-change">{copy.allUpToDate}</span>
              </div>
            </div>
            <div className="chart-heading">
              <strong>{copy.weeklyActivity}</strong>
              <span>{copy.exampleValues}</span>
            </div>
            <div
              className="chart"
              role="img"
              aria-label={copy.chartDescription}
            >
              {[
                [copy.days[0], 38],
                [copy.days[1], 55],
                [copy.days[2], 47],
                [copy.days[3], 72],
                [copy.days[4], 88],
                [copy.days[5], 62],
                [copy.days[6], 45],
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
              <span>
                {copy.exampleWorkspace} - {copy.syntheticValues}
              </span>
              <span>{copy.updatedJustNow}</span>
            </div>
          </main>
          <p className="page-footnote">{copy.pageFootnote}</p>
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
    localeAware: true,
    localeBrand: "grade10",
    verification: { caseId: "vc_demo-shell" },
  },
} satisfies Meta<typeof UiVerificationDemoShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
