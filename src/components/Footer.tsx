import { Box, styled } from "@mui/material";

const FooterContainer = styled(Box)(() => ({
	maxWidth: "1080px",
	width: "100%",
	margin: "auto",
	marginTop: "16px",
}));

export default function Footer() {
	return <FooterContainer>&copy; LUMIA.KR Eternal Return and all related logos are trademarks of Nimble Neuron, inc or its affiliates.</FooterContainer>;
}
