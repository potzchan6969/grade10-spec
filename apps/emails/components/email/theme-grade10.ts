import type { EmailTheme } from "./email-theme";

/**
 * Grade10 tokens mapped into the emailcn `EmailTheme` shape.
 * Values from `packages/design-system/tokens.json` (orange primary, stone).
 */
export const grade10Theme: EmailTheme = {
  borderRadius: "6px",
  borderRadiusLg: "12px",
  button: {
    primary: {
      backgroundColor: "#C4903D",
      borderRadius: "9999px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "500",
      paddingX: "24px",
      paddingY: "12px",
    },
    secondary: {
      backgroundColor: "transparent",
      border: "1px solid #E6E5E5",
      borderRadius: "9999px",
      color: "#1B1918",
      fontSize: "14px",
      fontWeight: "500",
      paddingX: "24px",
      paddingY: "12px",
    },
  },
  colorBackground: "#FAFAF9",
  colorBackgroundMuted: "#FFFFFF",
  colorBackgroundSubtle: "#F5F5F4",
  colorBorder: "#E6E5E5",
  colorBorderSubtle: "#F5F5F4",
  colorDanger: "#DC2626",
  colorPrimary: "#C4903D",
  colorPrimaryForeground: "#FFFFFF",
  colorPrimaryHover: "#A47832",
  colorSuccess: "#16A34A",
  colorText: "#1B1918",
  colorTextMuted: "#555350",
  colorTextSubtle: "#9D9A97",
  colorWarning: "#C4903D",
  containerWidth: "600px",
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMono: '"Menlo", "Monaco", "Courier New", monospace',
  fontSizeBase: "14px",
  fontSizeHeading: "24px",
  fontSizeLg: "16px",
  fontSizeSm: "12px",
  fontSizeXl: "20px",
  fontWeightBold: "600",
  fontWeightMedium: "500",
  fontWeightNormal: "400",
  lineHeightBase: "1.6",
  spacingBase: "24px",
  spacingLg: "32px",
  spacingXl: "48px",
};

/** @deprecated Prefer `grade10Theme`. */
export const grade10EmailTheme = grade10Theme;
