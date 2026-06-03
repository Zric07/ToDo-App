package com.example.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.jeep.plugin.capacitor.CapacitorSQLite;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CapacitorSQLite.class);
        super.onCreate(savedInstanceState);
    }
}