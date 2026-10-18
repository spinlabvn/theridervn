import { author } from "./author";
import { blockContent } from "./blockContent";
import { category } from "./category";
import { localeBlockContent, localeString, localeText } from "./locale";
import { post } from "./post";

export const schemaTypes = [localeString, localeText, blockContent, localeBlockContent, category, author, post];
