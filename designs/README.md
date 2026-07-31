# Pencil design files

This directory holds the versioned [Pencil](https://www.pen.dev/) source files for the AceTrader UI components. Keep `.pen` files alongside the specifications and PRDs they describe so design and specification changes can be reviewed in the same pull request.

## Start designing

1. Install and activate the Pencil desktop app or IDE extension.
2. Open [`acetrader-ui.pen`](./acetrader-ui.pen) in Pencil.
3. Add component designs or screens, then save the file before committing it with the related component or specification change.

Pencil starts its MCP server automatically while the app or extension is running. In Codex, verify that the `pencil` server appears in `/mcp` before asking an agent to edit a design.

## Conventions

- Keep reusable component primitives in `acetrader-ui.pen`. Turn it into a Pencil design library only when its component API is stable enough to share across additional design files.
- Use one additional, kebab-case `.pen` file per distinct feature or exploration when needed, such as `featured-markets.pen`.
- [`featured-markets.pen`](./featured-markets.pen) recreates the `FeaturedMarkets` fixture in desktop and mobile-ready states. Its source values come from the component's stories and style tokens as they stood in the former `packages/ui-components` package.
- Commit `.pen` source files to Git. Do not commit derived exports unless a PRD or OpenSpec change explicitly requires them.
- Treat the component's implementation in the consuming application as the implementation source of truth. Pencil files are design artifacts and must not contain product data, routing, authentication, or application orchestration.
