export enum MessageType {
    Unknown,
    CustomerCreated,
    CustomerUpdated,
    CustomerDeleted
  }

export namespace MessageType {
    export function toString(type: MessageType) {
      return messageTypeName.get(type);
    }

    export function parse(type: string): MessageType {
      for (const iterator of messageTypeName.entries()) {
        if (iterator['1'] === type) {
          return iterator['0'];
        }
      }

      return MessageType.Unknown;
    }
  }

const messageTypeName = new Map<MessageType, string>([
    [MessageType.CustomerCreated, 'CustomerCreated'],
    [MessageType.CustomerUpdated, 'CustomerUpdated'],
    [MessageType.CustomerDeleted, 'CustomerDeleted']
  ]);
