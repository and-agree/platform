Feature:
    As a manager
    I want the functions to pickup the creation of a decision
    So that deciders can be sent emails

    Scenario: Parsing of emails when sent from sendgrid
        Given there is a decision created using:
            | uid | aaaaaaaaaaaaaaaaaaaaaaaa |
            | team | { "deciders": [{ "email": "example@test.andagree.com", "pending": true, "response": "UNKNOWN" }] } |
        When calling the "http://localhost:5001/andagree-testing/europe-west2/DecisionParse" endpoint with file "sendgrid/multipart.txt"
        Then there is a collection "decisions" with document "{{ decision.uid }}"
        And the document contains:
            | team | { "deciders": [{ "email": "example@test.andagree.com", "pending": false, "response": "APPROVED" }] } |
