import { IPerson } from '../interfaces/person.interface';
import { NewPersonConstructor } from '../types/new-person-constructor.type';
import { ExistingPersonConstructor } from '../types/existing-person-constructor.type';
import { IPersonPrivateData } from '../interfaces/person-private-data.interface';

export class Person implements IPerson {
  private readonly phone: string;
  private readonly email?: string;

  public constructor(config: NewPersonConstructor | ExistingPersonConstructor) {
    this.validateConfig(config);
    this.phone = config.phone;
    if (config.email) {
      this.email = config.email;
    }
  }

  privateData(): IPersonPrivateData {
    return {
      phone: this.phone,
      email: this.email ?? null,
    };
  }

  private validateConfig(
    config: NewPersonConstructor | ExistingPersonConstructor,
  ) {
    if (!('phone' in config || typeof config.phone === 'string')) {
      throw new Error('');
    }
  }
}
