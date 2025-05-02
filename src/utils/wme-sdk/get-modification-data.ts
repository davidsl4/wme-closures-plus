import { Model } from 'backbone';
import { User } from 'types/waze';
import { catchError } from 'utils/catch';
import { getWindow } from 'utils/window-utils';

type ModificationMetadata = import('wme-sdk-typings').MajorTrafficEvent['modificationData'];

type ModifiableDataModel = Model<{
  createdBy: number | null;
  createdOn: number;
  updatedBy: number | null;
  updatedOn: number;
}>;

function getUser(userId: number): User {
  const userRepository = getWindow<any>().W.model.users;
  const user = userRepository.getObjectById(userId);
  if (!user)
    throw new Error('User not found');
  return user;
}

function getUserName(userId: number): string | null {
  const [, userName] = catchError(() => getUser(userId).get('userName'));
  return userName ?? null;
}

export function getModificationMetadata(dataModelObject: ModifiableDataModel): ModificationMetadata {
  return {
    createdBy: getUserName(dataModelObject.get('createdBy')),
    createdOn: dataModelObject.get('createdOn') ?? null,
    updatedBy: getUserName(dataModelObject.get('updatedBy')),
    updatedOn: dataModelObject.get('updatedOn') ?? null,
  };
}
