import { BigNumber } from "@ethersproject/bignumber";

export enum EXAMPLE_ENUM {
  EXAMPLE_FIRST = "EXAMPLE_FIRST",
  EXAMPLE_TWO = "EXAMPLE_TWO",
}

export const toHuman = (amount: BigNumber, decimals: number): number => {
  console.log({ amount })
  return parseFloat(amount.div(BigNumber.from(10).pow(decimals)).toString());
};

export const fromHumanString = (
  amount: string,
  decimals: number
): BigNumber => {
  const [integerPart, fractionalPart = ""] = amount.split(".");
  const fractionalLength = fractionalPart.length;

  if (fractionalLength > decimals) {
    throw new Error("Too many decimal places");
  }

  const integerBigNumber = BigNumber.from(integerPart);
  const fractionalBigNumber = BigNumber.from(
    fractionalPart.padEnd(decimals, "0")
  );

  return integerBigNumber
    .mul(BigNumber.from(10).pow(decimals))
    .add(fractionalBigNumber);
};

export const mulDec = (a: BigNumber, x: number): BigNumber => {
  return a.mul(BigNumber.from(x));
};

export const divToNumber = (a: BigNumber, b: BigNumber): number => {
  return parseFloat(a.div(b).toString());
};

export const bigCompare = (a: BigNumber, b: BigNumber): 0 | 1 | -1 => {
  if (a.eq(b)) {
    return 0;
  }

  return a.gt(b) ? 1 : -1;
};

export enum EPaymentEvents {
  login = "7234cd9d55",
  withdraw = "6f6363325c",
  deposit = "13474ade7",
  setAdminWallet = "9a2d27683581f",
  updateBalance = "updateBalance",
  paymentFailed = "payment-failed",
}

// 30 seconds
export const CAllowTimeDiff = 30 * 1000;
