import ExcelJS from "exceljs";

export const generateCustomersExcel = async (customers) => {
    try {
        // Создаем новую книгу Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Клиенты");

        // Задаем стили
        const headerStyle = {
            font: { bold: true, size: 12 },
            alignment: { vertical: "middle", horizontal: "center", wrapText: true },
            border: {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD3D3D3" },
            },
        };

        const cellStyle = {
            alignment: { vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            },
        };

        // Добавляем заголовки
        const headers = [
            { header: "ID", key: "id", width: 5 },
            { header: "Тип клиента", key: "type", width: 13 },
            { header: "Фамилия", key: "surname", width: 18 },
            { header: "Имя", key: "firstName", width: 18 },
            { header: "Отчество", key: "patronymic", width: 18 },
            { header: "Email", key: "email", width: 25 },
            { header: "Статус", key: "status", width: 12 },
            { header: "ИНН", key: "inn", width: 15 },
            { header: "Наименование компании", key: "companyName", width: 25 },
            { header: "Главный бухгалтер", key: "booker", width: 25 },
            { header: "Директор", key: "director", width: 25 },
            { header: "Банк", key: "bank", width: 15 },
            { header: "Расчетный счет", key: "account", width: 30 },
            { header: "БИК", key: "bik", width: 15 },
        ];

        worksheet.columns = headers;

        // Применяем стили к заголовкам
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.style = headerStyle;
        });

        // Добавляем данные
        customers.forEach((customer) => {
            const rowData = {
                id: customer.ID,
                type: customer.customer_type === "phys" ? "Физ. лицо" : "Юр. лицо",
                surname: customer.surname || "-",
                firstName: customer.first_name || "-",
                patronymic: customer.patronymic || "-",
                email: customer.email,
                status: customer.status === "active" ? "Не должник" : "Должник",
                inn: customer.inn || "-",
                companyName: customer.name || "-",
                booker: customer.main_booker || "-",
                director: customer.director || "-",
                bank: customer.payment_char?.bank || "-",
                account: customer.payment_char?.payment_number || "-",
                bik: customer.payment_char?.bik || "-",
            };

            const row = worksheet.addRow(rowData);
            row.eachCell((cell) => {
                cell.style = cellStyle;
            });
        });

        // Генерируем и скачиваем файл
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Клиенты_${new Date().toLocaleDateString("ru-RU")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error(`Не удалось сгенерировать Excel файл: ${error.message}`);
    }
};
