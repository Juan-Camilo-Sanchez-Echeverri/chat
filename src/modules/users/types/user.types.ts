import { HydratedDocument } from 'mongoose';
import { Role, Status } from '@common/enums';

import { DocumentType } from '../enums/document-type.enum';

import { ObjectId } from '../../../common/types/mongo.types';

export interface User {
  _id: string;
  email: string;
  phone?: string;
  validPhone?: boolean;
  password: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
  documentType?: DocumentType;
  documentNumber?: string;
  institution: ObjectId;
  role: Role;
  status?: Status;
  chatLockedForStudents?: boolean;
  chatLockedForProfessors?: boolean;
  chatLockedForInappropriate?: boolean;
  lastLogin?: Date;
  online?: boolean;
  expirationAccount?: Date;
  isCaretaker?: boolean;
}

export type UserDocument = HydratedDocument<User>;
