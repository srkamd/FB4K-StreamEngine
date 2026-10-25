"""
Master Test Runner: FB4KDownloader Test Suite
Executes all unit, integration, and SQA test cases.
"""

import unittest
import sys
import os
import time

def run_suite():
    test_dir = os.path.dirname(__file__)
    loader = unittest.TestLoader()
    suite = loader.discover(start_dir=test_dir, pattern='test_*.py')

    print("=" * 70)
    print("  FB4KDownloader Enterprise SQA & Unit Test Execution Engine")
    print("=" * 70)
    print(f"Discovered test cases across suite modules...")
    print(f"Target: Website Backend, Frontend DOM, and Chrome Extension MV3")
    print("-" * 70)

    start_time = time.time()
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    elapsed = time.time() - start_time

    print("-" * 70)
    print(f"Execution completed in {elapsed:.3f} seconds.")
    print(f"Total Tests Run : {result.testsRun}")
    print(f"Successes       : {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures        : {len(result.failures)}")
    print(f"Errors          : {len(result.errors)}")
    print("=" * 70)

    if result.wasSuccessful():
        print(" [PASSED] ALL TEST CASES PASSED WITH 100% SUCCESS RATE")
        return 0
    else:
        print(" [FAILED] SOME TEST CASES FAILED - REVIEW LOGS ABOVE")
        return 1

if __name__ == '__main__':
    sys.exit(run_suite())
