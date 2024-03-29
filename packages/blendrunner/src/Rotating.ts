export function RotationCSS(): string {
	return `@keyframes rotating
	{
	from
		{
		transform: rotate(0deg);
		-o-transform: rotate(0deg);
		-ms-transform: rotate(0deg);
		-moz-transform: rotate(0deg);
		-webkit-transform: rotate(0deg);
		}
	to
		{
		transform: rotate(360deg);
		-o-transform: rotate(360deg);
		-ms-transform: rotate(360deg);
		-moz-transform: rotate(360deg);
		-webkit-transform: rotate(360deg);
		}
	}
@-webkit-keyframes rotating
	{
	from
		{
		transform: rotate(0deg);
		-webkit-transform: rotate(0deg);
		}
	to
		{
		transform: rotate(360deg);
		-webkit-transform: rotate(360deg);
		}
	}
.x-waiting .rotating
	{
	-webkit-animation: rotating 2s linear infinite;
	-moz-animation: rotating 2s linear infinite;
	-ms-animation: rotating 2s linear infinite;
	-o-animation: rotating 2s linear infinite;
	animation: rotating 2s linear infinite;
	}`;
}
