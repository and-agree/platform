Feature:
    As a manager
    I want the functions to pickup the creation of a decision
    So that deciders can be sent emails

    Scenario: Parsing of emails when sent from sendgrid (agree)
        Given there is a decision created using:
            | uid      | aaaaaaaaaaaaaaaaaaaaaaaa                                                                                                                                                     |
            | deciders | [{ "email": "example-one@test.andagree.com", "pending": true, "status": "UNDEFINED" }, { "email": "example-two@test.andagree.com", "pending": true, "status": "UNDEFINED" }] |
            | status   | PENDING                                                                                                                                                                      |
        When calling the "http://localhost:5001/andagree-testing/europe-west2/DecisionParse" endpoint with file "sendgrid/multipart-agree.txt"
        Then there is a collection "decisions" with document "{{ decision.uid }}"
        And the document contains:
            | deciders  | [{ "email": "example-one@test.andagree.com", "pending": false, "status": "APPROVED" }, { "email": "example-two@test.andagree.com", "pending": true, "status": "UNDEFINED" }] |
            | responses | 50                                                                                                                                                                           |

    Scenario: Parsing of emails when sent from sendgrid (disagree)
        Given there is a decision created using:
            | uid      | aaaaaaaaaaaaaaaaaaaaaaaa                                                                                                                                                     |
            | deciders | [{ "email": "example-one@test.andagree.com", "pending": true, "status": "UNDEFINED" }, { "email": "example-two@test.andagree.com", "pending": true, "status": "UNDEFINED" }] |
            | status   | PENDING                                                                                                                                                                      |
        When calling the "http://localhost:5001/andagree-testing/europe-west2/DecisionParse" endpoint with file "sendgrid/multipart-disagree.txt"
        Then there is a collection "decisions" with document "{{ decision.uid }}"
        And the document contains:
            | deciders  | [{ "email": "example-one@test.andagree.com", "pending": true, "status": "UNDEFINED" }, { "email": "example-two@test.andagree.com", "pending": false, "status": "REJECTED" }] |
            | responses | 50                                                                                                                                                                           |
