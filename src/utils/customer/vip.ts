// Import Dependencies
import { CCustomerVipConfig } from "@/constant/customer";
import UserService from "@/modules/user/user.service";
import { IVIPLevelType } from "@/modules/user/user.types";
import UserBotService from "@/modules/user-bot/user-bot.service";

import logger from "../logger";

const {
  numLevels,
  minWager,
  maxWager,
  rakeback,
  vipLevelNAME,
  vipLevelCOLORS,
} = CCustomerVipConfig;

// Generate VIP Levels
const generateVIPLevels = (
  numLevels: number,
  minWager: number,
  maxWager: number,
  rakeback: number,
  levelNames: string[],
  levelColors: string[]
) => {
  const levels = [];

  for (let i = 0; i < numLevels; i++) {
    const level = {
      name: (i + 1).toString(),
      wagerNeeded: parseFloat(
        (minWager + (maxWager - minWager) * Math.pow(i / numLevels, 2)).toFixed(
          2
        )
      ),
      rakebackPercentage: parseFloat(
        (rakeback / (1 + Math.exp(-5 * (i / numLevels - 0.5)))).toFixed(2)
      ),
      levelName: levelNames[Math.floor((i * levelNames.length) / numLevels)],
      levelColor: levelColors[Math.floor((i * levelColors.length) / numLevels)],
    };
    levels.push(level);
  }

  return levels;
};

const vipLevels = generateVIPLevels(
  numLevels,
  minWager,
  maxWager,
  rakeback,
  vipLevelNAME,
  vipLevelCOLORS
);

// Get user VIP level
const getVipLevelFromWager = (wager: number): IVIPLevelType => {
  if (wager < vipLevels[1].wagerNeeded) {
    return vipLevels[0];
  } else if (wager > vipLevels[numLevels - 1].wagerNeeded) {
    return vipLevels[numLevels - 1];
  } else {
    return vipLevels
      .filter((level) => wager >= level.wagerNeeded)
      .sort((a, b) => b.wagerNeeded - a.wagerNeeded)[0];
  }
};

// Get user next VIP level
const getNextVipLevelFromWager = (wager: number) => {
  return vipLevels
    .filter((level) => wager < level.wagerNeeded)
    .sort((a, b) => a.wagerNeeded - b.wagerNeeded)[0];
};

// Check if user is eligible for rakeback
const checkAndApplyRakeback = async (
  userId: string,
  _houseRake: number
): Promise<void> => {
  try {
    const userService = new UserService();
    const userBotService = new UserBotService();
    const usero = await userBotService.getItemById(userId);

    if (usero) {
      // Skip rakeback calculation for excluded users
      return;
    }

    const user = await userService.getItemById(userId);

    if (!user) {
      // User not found
      return;
    }

    // Find the corresponding level
    // @TO-DO I will update this to use the new VIP level system
    // const currentLevel = getVipLevelFromWager(user.wager);

    // Update document
    await userService.update(
      { _id: user._id },
      {
        // $inc: { rakebackBalance: houseRake * (currentLevel.rakebackPercentage! / 100) },
      }
    );

    // Resolve to continue successfully
  } catch (error) {
    logger.error("[VIP]::: Error applying rakeback" + error);
  }
};

// Export functions
export {
  checkAndApplyRakeback,
  getNextVipLevelFromWager,
  getVipLevelFromWager,
  vipLevelCOLORS,
  vipLevelNAME,
  vipLevels,
};
