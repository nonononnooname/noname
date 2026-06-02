import type { Product } from "../../data";
import { SwapMock } from "./swap-mock";
import { StakeMock } from "./stake-mock";
import { BridgeMock } from "./bridge-mock";
import { HardwareMock } from "./hardware-mock";
import { WalletMock } from "./wallet-mock";

/** Product key → its interface mock. Verified exhaustive via `satisfies`. */
export const PRODUCT_MOCKS = {
  dex: SwapMock,
  staking: StakeMock,
  bridge: BridgeMock,
  hardware: HardwareMock,
  wallet: WalletMock,
} satisfies Record<Product["key"], React.ComponentType>;
