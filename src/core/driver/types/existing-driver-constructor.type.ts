import { NewDriverConstructor } from './new-driver-constructor.type';

export type ExistingDriverConstructor = NewDriverConstructor & { id: string };
