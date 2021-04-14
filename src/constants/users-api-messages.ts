export enum UsersApiMessages {
  INVALID_ID = 'Invalid id.',
  NO_USER_UPDATED = 'No user was found to update for your id',
  NO_USER_DELETED = 'No user was found to delete for your id',
  MISSING_PAGING_PARAMS = 'Please use the query params "from" and "size" concomitantly',
  PAGING_SIZE_TOO_LARGE = 'Please use a maximum page size of 100 objects',
  USER_NOT_FOUND = 'User not found!',
  ERROR_WHILE_CREATING_NEW_USER = 'An error occurred while creating a new user',
  ERROR_WHILE_GETTING_USER = 'An error occurred while getting user with id:',
  ERROR_WHILE_GETTING_USERS = 'An error occurred while getting users',
  ERROR_WHILE_UPDATING_USER = 'An error occurred while updating user with id:',
  ERROR_WHILE_DELETING_USER = 'An error occurred while deleting user with id:',
}
