//// Content Model ////

export type CID = string;

export type NodeType = 'goal' | 'task';

export type ContentNode = {
  cid: CID;
  title: string;
  children: CID[];
  type: NodeType;
  // more metadata here
};

export type ContentModel = {
  [key: CID]: ContentNode;
};

//// Structure Model ////

export type SID = string;

export type StructureNode = {
  sid: SID;
  opened: boolean;
  children: SID[];
};

export type StructureModel = {
  [key: SID]: StructureNode;
};

//// Position Model ////

export type Row = number;

export type RowData = {
  me: Row;
  lastChild: Row;
  lastDescendant: Row;
};

export type PositionNode = {
  sid: SID;
  row: RowData;
};

export type PositionModel = Map<SID, PositionNode>;

//// General ////

export type Caret = {
  visible: boolean;
  yMe: number;
  yCaret: number;
  yLastChild: number;
  layer: number;
  sid: SID;
  pos: number;
};
