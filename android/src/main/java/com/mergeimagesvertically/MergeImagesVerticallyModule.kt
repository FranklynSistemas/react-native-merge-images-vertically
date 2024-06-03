package com.mergeimagesvertically

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Paint
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream

class ImagesMergeModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ImagesMerge"

    @ReactMethod
    fun mergeImages(imgs: ReadableArray, callback: Callback) {
        val bitmapArray = ArrayList<Bitmap>()

        for (i in 0 until imgs.size()) {
            val argObject = imgs.getMap(i)!!
            val url = argObject.getString("uri")!!
            val base64String = url.substring(url.indexOf(",") + 1)
            val decodedString = Base64.decode(base64String, Base64.DEFAULT)
            val imgBitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
            bitmapArray.add(imgBitmap)
        }

        val maxWidth = bitmapArray.maxOf { it.width }
        val totalHeight = bitmapArray.sumOf { (it.height * maxWidth / it.width) }

        val result = Bitmap.createBitmap(maxWidth, totalHeight, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(result)
        var lastPos = 0

        for (bitmap in bitmapArray) {
            val aspectRatio = maxWidth.toFloat() / bitmap.width
            val height = (bitmap.height * aspectRatio).toInt()
            canvas.drawBitmap(Bitmap.createScaledBitmap(bitmap, maxWidth, height, true), 0f, lastPos.toFloat(), Paint(Paint.ANTI_ALIAS_FLAG))
            lastPos += height
        }

        val stream = ByteArrayOutputStream()
        result.compress(Bitmap.CompressFormat.PNG, 100, stream)
        val byteArray = stream.toByteArray()
        result.recycle()
        val encoded = Base64.encodeToString(byteArray, Base64.DEFAULT)
        callback.invoke(encoded)
    }
}
