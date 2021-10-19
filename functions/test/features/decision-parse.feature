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

    # TODO: Need to find a way to hook into this type of function to be able to run mock expectations
    # Scenario: Send email when all responses made
    #     Given there is a POST endpoint at "https://api.sendgrid.com:443/v3/mail/send" which will a status of 200 when called with "sendgrid/decision-review.json"
    #     And there is a decision created using:
    #         | uid      | aaaaaaaaaaaaaaaaaaaaaaaa                                                               |
    #         | deciders | [{ "email": "example-one@test.andagree.com", "pending": true, "status": "UNDEFINED" }] |
    #         | status   | PENDING                                                                                |
    #     When calling the "http://localhost:5001/andagree-testing/europe-west2/DecisionParse" endpoint with file "sendgrid/multipart-agree.txt"
    #     Then there is a collection "decisions" with document "{{ decision.uid }}"
    #     And the document contains:
    #         | deciders  | [{ "email": "example-one@test.andagree.com", "pending": false, "status": "APPROVED" }] |
    #         | responses | 100                                                                                    |
