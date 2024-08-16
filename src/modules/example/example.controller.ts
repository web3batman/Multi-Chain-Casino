import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { ExampleService, IExample } from "./";

export class ExampleController {
  // Services
  private exampleService: ExampleService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.exampleService = new ExampleService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const exampleFilter = <FilterQuery<IExample>>{};
    const [item, count] = await Promise.all([
      this.exampleService.get(exampleFilter),
      this.exampleService.getCount(exampleFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const example = await this.exampleService.getItem({ name });

    // need add to localizations
    if (!example) {
      throw new CustomError(404, "Example not found");
    }

    return example;
  };

  public getById = async (exampleId) => {
    const example = await this.exampleService.getItemById(exampleId);

    // need add to localizations
    if (!example) {
      throw new CustomError(404, "Example not found");
    }

    return example;
  };

  public create = async (example) => {
    try {
      return await this.exampleService.create(example);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, exampleData) => {
    try {
      const example = await this.exampleService.updateById(id, exampleData);

      // need add to localizations
      if (!example) {
        throw new CustomError(404, "Example not found");
      }

      return example;
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
    const example = await this.exampleService.deleteById(id);

    // need add to localizations
    if (!example) {
      throw new CustomError(404, "Example not found");
    }

    return example;
  };
}
