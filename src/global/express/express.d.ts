//Adding Custom Properties in Express Namespace

import * as express from "express";

//This makes sure you're extending  existing interfaces rather than defining a new ones

declare global {
  namespace Express {
    export interface Request {
      userId: string;
    }
  }
  //Add More Properties
}
