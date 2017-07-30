export interface Validator {
  $key: string,
  appliedUsers: Array<string>;
  description: string;
  displayName: string;
  trustedUsers: Array<string>;
  profilePicURL: string;
  requirements: Array<string>;
}
