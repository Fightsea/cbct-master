declare global {
  type Enum<T> = {
    [key: string | number]: T
  }

  type uuid = string;

  /**
   * YYYY-MM-DD HH:mm:ss
   */
  type datetime = string;

  /**
   * YYYY-MM-DD
   */
  type date = string;

  /**
   * HH:mm:ss | HH:mm
   */
  type time = string;

  type Nullable<T> = T | null;

  /**
   * http(s)://example.com/path/to/resource
   */
  type Url = string;
}

export {};
