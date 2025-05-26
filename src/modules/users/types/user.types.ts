import { HydratedDocument } from 'mongoose';
import { Role, Status } from '@common/enums';

import { DocumentType } from '../enums/document-type.enum';

import { ObjectId } from '@common/types/mongo.types';

export interface User {
  _id: ObjectId;
  email: string;
  phone?: string;
  validPhone?: boolean;
  statusPhone?: 'active' | 'inactive';
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
  lastLogin?: Date;
  online?: boolean;
  expirationAccount?: Date;
  isCaretaker?: boolean;
  inChat: string;
  lastActivity?: Date;
}

export type UserDocument = HydratedDocument<User>;
