import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { ChatHistoryService, IChatHistoryModel } from ".";

export class ChatHistoryController {
  // Services
  private chatHistoryService: ChatHistoryService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.chatHistoryService = new ChatHistoryService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const chatHistoryFilter = <FilterQuery<IChatHistoryModel>>{};
    const [item, count] = await Promise.all([
      this.chatHistoryService.get(chatHistoryFilter),
      this.chatHistoryService.getCount(chatHistoryFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const chatHistory = await this.chatHistoryService.getItem({ name });

    // need add to localizations
    if (!chatHistory) {
      throw new CustomError(404, "ChatHistory not found");
    }

    return chatHistory;
  };

  public getById = async (chatHistoryId) => {
    const chatHistory =
      await this.chatHistoryService.getItemById(chatHistoryId);

    // need add to localizations
    if (!chatHistory) {
      throw new CustomError(404, "ChatHistory not found");
    }

    return chatHistory;
  };

  public create = async (chatHistory) => {
    try {
      return await this.chatHistoryService.create(chatHistory);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, chatHistoryData) => {
    try {
      const chatHistory = await this.chatHistoryService.updateById(
        id,
        chatHistoryData
      );

      // need add to localizations
      if (!chatHistory) {
        throw new CustomError(404, "ChatHistory not found");
      }

      return chatHistory;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      } else if (error.status) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
      }
    }
  };

  public delete = async ({ id }) => {
    const chatHistory = await this.chatHistoryService.deleteById(id);

    // need add to localizations
    if (!chatHistory) {
      throw new CustomError(404, "ChatHistory not found");
    }

    return chatHistory;
  };
}
