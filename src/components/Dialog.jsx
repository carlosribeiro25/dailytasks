
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ open, onClose, onConfirm, isPending }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Apagar tarefa?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Essa ação não pode ser desfeita. Tem certeza que deseja apagar esta tarefa?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isPending}
          autoFocus
        >
          {isPending ? 'Apagando...' : 'Apagar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
