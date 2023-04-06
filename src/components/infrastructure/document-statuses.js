const statuses = ["Новый", "Завершен", "Подтвержден", "Отменен", "Обработка"];
export const GetDocumentStatusName = (status) => statuses[status];

export const DOCUMENT_STATUS = {
    New: 0, Complited: 1, Successed: 2, Canceled: 3, Processing: 4
}
export const DOCUMENT_STATUS_NEW = 0;
export const DOCUMENT_STATUS_COMPLITED = 0;
export const DOCUMENT_STATUS_SUCCESSED = 0;
export const DOCUMENT_STATUS_CANCELED = 0;
export const DOCUMENT_STATUS_PROCESSING = 0;