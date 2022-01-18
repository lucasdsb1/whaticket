import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

// const filter = createFilterOptions({
// 	trim: true,
// });

const useStyles = makeStyles((theme) => ({
	maxWidth: {
	  width: "100%",
	  marginTop: 20
	},
}));

const AcceptTicketWithouSelectQueue = ({ modalOpen, onClose, ticketId }) => {
	const history = useHistory();
	const classes = useStyles();
	const [selectedQueue, setSelectedQueue] = useState('');
	const [loading, setLoading] = useState(false);
	const { user } = useContext(AuthContext);

	const handleClose = () => {
		onClose();
		setSelectedQueue("");
	};

    const handleUpdateTicketStatus = async (queueId) => {
		setLoading(true);
		try {
			await api.put(`/tickets/${ticketId}`, {
				status: "open",
				userId: user?.id || null,
                queueId: queueId
			});

			setLoading(false);
			history.push(`/tickets/${ticketId}`);
            handleClose();
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	return (
		<>
			<Dialog open={modalOpen} onClose={handleClose}>
				<DialogTitle id="form-dialog-title">
					{i18n.t("ticketsList.acceptModal.title")}
				</DialogTitle>
				<DialogContent dividers>
					<FormControl variant="outlined" className={classes.maxWidth}>
						<InputLabel>{i18n.t("ticketsList.acceptModal.queue")}</InputLabel>
						<Select
							value={selectedQueue}
							onChange={(e) => setSelectedQueue(e.target.value)}
							label={i18n.t("ticketsList.acceptModal.queue")}
						>
							<MenuItem value={''}>&nbsp;</MenuItem>
							{user.queues.map((queue) => (
								<MenuItem key={queue.id} value={queue.id}>{queue.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="secondary"
						disabled={loading}
						variant="outlined"
					>
						{i18n.t("ticketsList.buttons.cancel")}
					</Button>
					<ButtonWithSpinner
						variant="contained"
						type="button"
						disabled={(selectedQueue === "")}
						onClick={() => handleUpdateTicketStatus(selectedQueue)}
						color="primary"
						loading={loading}
					>
						{i18n.t("ticketsList.buttons.start")}
					</ButtonWithSpinner>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AcceptTicketWithouSelectQueue;
