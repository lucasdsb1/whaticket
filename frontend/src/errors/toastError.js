import { toast } from "react-toastify";
import { i18n } from "../translate/i18n";

const toastError = err => {
	const errorMsg = err.response?.data?.message || err.response.data.error;
	const additionalData = err.response?.data?.additionalData;

	if (errorMsg) {
		let msg = "";
		if (i18n.exists(`backendErrors.${errorMsg}`)) {
			if (errorMsg === "ERR_OTHER_OPEN_TICKET" && additionalData.user && additionalData.queue) {
				msg = errOtherOpenTicket(additionalData);
			}
			else {
				msg = i18n.t(`backendErrors.${errorMsg}`);
			}

			toast.error(msg, {
				toastId: errorMsg,
			});
		} else {
			toast.error(errorMsg, {
				toastId: errorMsg,
			});
		}
	} else {
		toast.error("An error occurred!");
	}
};

const errOtherOpenTicket = additionalData => {
	const msg = `${i18n.t("backendErrors.ERR_OTHER_OPEN_TICKET")}
	${additionalData.queue.toUpperCase()}
	${i18n.t("backendErrors.ERR_OTHER_OPEN_TICKET_2")}
	${additionalData.user.toUpperCase()}.`;

	return msg;
};

export default toastError;
