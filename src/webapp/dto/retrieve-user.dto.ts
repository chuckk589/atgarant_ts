import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';
import { Users } from 'src/mikroorm/entities/Users';

export class RetrieveWebAppUser {
  constructor(user: Users) {
    console.log(user);
    this.chatId = user.chatId;
    this.username = user.username;
    this.id = user.id;
    this.violations = user.violations?.length;
    this.offers = user.profile?.offersAsBuyer + user.profile?.offersAsSeller;
  }
  chatId: string;
  username: string;
  id: number;
  violations: number;
  offers: number;
}
