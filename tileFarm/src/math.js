export function isPowerOf2(v) {
	return (v & (v-1)) == 0;
}