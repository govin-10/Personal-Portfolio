import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { post } from "./post";
import { profile } from "./profile";
import { project } from "./project";

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  post,
  profile,
  blockContent,
];
