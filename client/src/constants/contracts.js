import {
    ShoppingOutlined,
    FolderOutlined,
    FileTextOutlined,
    BarcodeOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";

export const CONTRACTS = [
    { name: "order", label: "Договор заказа", icon: <ShoppingOutlined /> },
    { name: "invoice", label: "Накладная", icon: <FolderOutlined /> },
    { name: "receipt", label: "Чек оплаты", icon: <FileTextOutlined /> },
    { name: "acceptance", label: "Акт получения", icon: <ScheduleOutlined /> },
    { name: "other", label: "Прочие договоры", icon: <BarcodeOutlined /> },
];

