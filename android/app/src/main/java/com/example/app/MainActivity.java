package com.example.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.jeep.plugin.capacitor.cdssutils.CapacitorSQLitePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CapacitorSQLitePlugin.class);
        super.onCreate(savedInstanceState);
    }
}