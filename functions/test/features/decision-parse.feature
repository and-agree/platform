Feature:
    As a manager
    I want the functions to pickup the creation of a decision
    So that deciders can be sent emails

    Scenario: Parsing of emails when sent from sendgrid
        Given there is a decision created using:
            | uid      | aaaaaaaaaaaaaaaaaaaaaaaa                                                             |
            | deciders | [{ "email": "example@test.andagree.com", "pending": true, "response": "UNDEFINED" }] |
        When calling the "http://localhost:5001/andagree-testing/europe-west2/DecisionParse" endpoint with file "sendgrid/multipart.txt"
        Then there is a collection "decisions" with document "{{ decision.uid }}"
        And the document contains:
            | deciders | [{ "email": "example@test.andagree.com", "pending": false, "response": "APPROVED" }] |
            | feedback | 100                                                                                  |
