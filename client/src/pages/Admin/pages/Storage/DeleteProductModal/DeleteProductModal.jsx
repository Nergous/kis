import React from "react";
import { Modal, Button, Typography } from "antd";

const { Text } = Typography;

const DeleteProductModal = ({ visible, onCancel, onConfirm, productName }) => {
    return (
        <Modal
            title="Подтверждение удаления"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button key="delete" type="primary" danger onClick={onConfirm}>
                    Удалить
                </Button>,
            ]}
        >
            <Text>
                Вы уверены, что хотите удалить продукт <strong>{productName}</strong>? Это действие нельзя отменить.
            </Text>
        </Modal>
    );
};

export default DeleteProductModal;