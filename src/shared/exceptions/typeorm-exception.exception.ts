/**
 * Class representing a TypeOrm Exception format
 * @author Rutakayile Samuel
 * @version 3.0
 */
export class TypeOrmException extends Error {
  code: string;
  name: string;
  message: string;
  detail: string;
}
