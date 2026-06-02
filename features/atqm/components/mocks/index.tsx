import type { Product } from "../../data";
import { SwapMock } from "./swap-mock";
import { StakeMock } from "./stake-mock";
import { BridgeMock } from "./bridge-mock";
import { WalletMock } from "./wallet-mock";

/** Product key → its interface mock. Verified exhaustive via `satisfies`. */
export const PRODUCT_MOCKS = {
  dex: SwapMock,
  staking: StakeMock,
  bridge: BridgeMock,
  wallet: WalletMock,
} satisfies Record<Product["key"], React.ComponentType>;
