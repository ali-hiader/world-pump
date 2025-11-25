interface LogMetadata {
	[key: string]: unknown
}

class Logger {
	private isDevelopment = process.env.NODE_ENV !== 'production'

	private formatMetadata(metadata?: LogMetadata): string {
		if (!metadata || Object.keys(metadata).length === 0) return ''
		return JSON.stringify(metadata, null, this.isDevelopment ? 2 : 0)
	}

	info(message: string, metadata?: LogMetadata): void {
		const meta = this.formatMetadata(metadata)
		console.log(`ℹ️  ${message}${meta ? ` ${meta}` : ''}`)
	}

	warn(message: string, metadata?: LogMetadata): void {
		const meta = this.formatMetadata(metadata)
		console.warn(`⚠️  ${message}${meta ? ` ${meta}` : ''}`)
	}

	error(message: string, error?: unknown, metadata?: LogMetadata): void {
		const errorDetails =
			error instanceof Error
				? {
						message: error.message,
						name: error.name,
						stack: this.isDevelopment ? error.stack : undefined,
					}
				: error

		const meta = this.formatMetadata({ error: errorDetails, ...metadata })
		console.error(`❌ ${message}${meta ? ` ${meta}` : ''}`)
	}

	debug(message: string, metadata?: LogMetadata): void {
		if (this.isDevelopment) {
			const meta = this.formatMetadata(metadata)
			console.debug(`🔍 ${message}${meta ? ` ${meta}` : ''}`)
		}
	}

	success(message: string, metadata?: LogMetadata): void {
		const meta = this.formatMetadata(metadata)
		console.log(`✅ ${message}${meta ? ` ${meta}` : ''}`)
	}
}

export const logger = new Logger()
