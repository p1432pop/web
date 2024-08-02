import { TableCell, tableCellClasses, TableRow, styled } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		textAlign: "center",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 16,
		textAlign: "center",
	},
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));
