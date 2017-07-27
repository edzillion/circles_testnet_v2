export interface Validator {
  $key: string,
  description: string;
  displayName: string;
  trustedUsers: Array<string>;
  profilePicURL: string;
  requirements: Array<string>;
}
