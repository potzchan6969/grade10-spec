// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4181-2010
// source=packages/design-system/src/components/display/pagination.tsx
// component=Pagination
import figma from "figma";

export default {
  example: figma.code`<Pagination>
  <PaginationPrevious disabled />
  <PaginationLink isActive>1</PaginationLink>
  <PaginationLink>2</PaginationLink>
  <PaginationLink>3</PaginationLink>
  <PaginationEllipsis />
  <PaginationLink>10</PaginationLink>
  <PaginationNext />
</Pagination>`,
  imports: [
    'import { Pagination, PaginationEllipsis, PaginationLink, PaginationNext, PaginationPrevious } from "@grade10/design-system"',
  ],
  id: "pagination",
  metadata: { nestable: true },
};
