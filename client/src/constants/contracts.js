import {
    ShoppingOutlined,
    FolderOutlined,
    FileTextOutlined,
    BarcodeOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";

export const CONTRACTS = [
    { name: "order", label: "Договоры заказов", icon: <ShoppingOutlined /> },
    { name: "storage", label: "Договоры хранения", icon: <FolderOutlined /> },
    { name: "service", label: "Договоры услуг", icon: <FileTextOutlined /> },
    { name: "payment", label: "Договоры оплаты", icon: <ScheduleOutlined /> },
    { name: "other", label: "Прочие договоры", icon: <BarcodeOutlined /> },
];
// можешь изменить данный компонент в связь введением файла константы, в этом компоненте ранее был
