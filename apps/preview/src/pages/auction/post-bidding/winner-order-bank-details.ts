/** Preview-only bank details — Grade10 / HSBC Hong Kong sample until Finance confirms live values. */
export const WINNER_ORDER_BANK_DETAILS = {
  beneficiaryName: "Grade10 Finance Limited",
  beneficiaryAddress: "Unit 2602, 28 Stanley Street, Central, Hong Kong",
  bankName: "HSBC Hong Kong",
  /** Main branch address, city and country. */
  bankAddress: "1 Queen's Road Central, Central, Hong Kong",
  bankCode: "004",
  branchCode: "001",
  /**
   * Full account number including bank and branch code
   * (`bank-branch-account`).
   */
  accountNumber: "004-001-583291-001",
  swiftCode: "HSBCHKHHXXX",
  fpsId: "12345678",
  /** Preview fixture aligned to bank-transfer invoice Order Total (fee Free). */
  totalAmountDue: "HK$16,340.00",
  /** Same invoice issued in US$ for a USD-settled order. */
  usdTotalAmountDue: "US$16,340.00",
  /** Payment reference — listing code, unchanged across reissues. */
  transferReference: "LK7P2Q",
} as const;
