import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from nutriai_backend.config import settings
from nutriai_backend.db import SessionLocal
from nutriai_backend.auth import AuthService
from nutriai_backend.health import HealthCalculator

logging.basicConfig(level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Welcome to NutriAI! Use /bmi to get your BMI and /diet to get a sample diet plan.')

async def bmi(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Please use /bmi <weight_kg> <height_cm>.')

async def bmi_calc(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    try:
        weight = float(context.args[0])
        height = float(context.args[1])
        bmi = HealthCalculator.calculate_bmi(weight, height)
        await update.message.reply_text(f'Your BMI is {bmi:.2f}')
    except Exception:
        await update.message.reply_text('Usage: /bmi <weight_kg> <height_cm>')

async def diet(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('This feature is coming soon. Use the web dashboard to generate personalized diet plans.')

if __name__ == '__main__':
    app = ApplicationBuilder().token(settings.telegram_token).build()
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('bmi', bmi_calc))
    app.add_handler(CommandHandler('diet', diet))
    app.run_polling()
