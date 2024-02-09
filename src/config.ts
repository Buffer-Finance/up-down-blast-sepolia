export enum State {
  active = 1,
  exercised = 2,
  expired = 3,
  queued = 4,
  cancelled = 5,
  opened = 6,
}

export enum TournamentState {
  created = "Created",
  verified = "Upcoming",
  started = "Live",
  closed = "Closed",
  ended = "Closed",
}

export enum Period {
  hourly = "hourly",
  daily = "daily",
  weekly = "weekly",
  total = "total",
}

export const RouterAddress = "0xC42D0a6d10fd4E0085F82cAE02Bb10a2A6b9650E";

export const USDC_POOL_CONTRACT = "0x2f4ea9d62C9Cb5Ae22f9c1F8472319Ea9A08D93c";
export const ARB_POOL_CONTRACT = "0x0C42C958C9Bc6B555F4e8e1AFC36dEd95CB05a24";

export const ZeroAddress = "0x0000000000000000000000000000000000000000";
