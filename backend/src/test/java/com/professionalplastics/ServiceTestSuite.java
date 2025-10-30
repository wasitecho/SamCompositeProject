package com.professionalplastics;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;

/**
 * Test suite for all service layer unit tests.
 * Run this class to execute all service tests at once.
 */
@Suite
@SelectPackages("com.professionalplastics.service")
public class ServiceTestSuite {
    // This class serves as a test suite runner
}
